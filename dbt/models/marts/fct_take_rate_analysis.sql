-- Take Rate Analysis fact table
with seller_take_rates as (
    select
        tenant_id,
        seller_id,
        order_date,
        order_year,
        order_month,
        count(distinct order_id) as total_orders,
        sum(gmv) as total_gmv,
        sum(commission_amount) as total_commission,
        avg(take_rate) as avg_take_rate,
        avg(commission_percentage) as avg_commission_percentage,
        sum(case when is_completed then gmv else 0 end) as completed_gmv,
        sum(case when is_completed then commission_amount else 0 end) as completed_commission,
        count(case when is_completed then 1 end) as completed_orders
    from {{ ref('stg_orders') }}
    group by 1, 2, 3, 4, 5
),

take_rate_metrics as (
    select
        *,
        -- Calculate effective take rate (commission / completed GMV)
        case 
            when completed_gmv > 0 then (completed_commission / completed_gmv) * 100
            else 0
        end as effective_take_rate,
        
        -- Calculate take rate tier
        case 
            when avg_take_rate >= 10 then 'high'
            when avg_take_rate >= 5 then 'medium'
            else 'low'
        end as take_rate_tier,
        
        -- Calculate commission per order
        case 
            when completed_orders > 0 then completed_commission / completed_orders
            else 0
        end as commission_per_order
    from seller_take_rates
),

tenant_take_rates as (
    select
        tenant_id,
        order_date,
        order_year,
        order_month,
        count(distinct seller_id) as total_sellers,
        sum(total_orders) as total_orders,
        sum(total_gmv) as total_gmv,
        sum(total_commission) as total_commission,
        avg(avg_take_rate) as avg_take_rate,
        avg(effective_take_rate) as avg_effective_take_rate,
        sum(completed_gmv) as completed_gmv,
        sum(completed_commission) as completed_commission,
        sum(completed_orders) as completed_orders,
        
        -- Calculate tenant-level take rate
        case 
            when sum(completed_gmv) > 0 then (sum(completed_commission) / sum(completed_gmv)) * 100
            else 0
        end as tenant_take_rate,
        
        -- Calculate weighted average take rate
        case 
            when sum(total_gmv) > 0 then (sum(total_commission) / sum(total_gmv)) * 100
            else 0
        end as weighted_take_rate
    from take_rate_metrics
    group by 1, 2, 3, 4
)

select
    tenant_id,
    order_date,
    order_year,
    order_month,
    total_sellers,
    total_orders,
    total_gmv,
    total_commission,
    avg_take_rate,
    avg_effective_take_rate,
    completed_gmv,
    completed_commission,
    completed_orders,
    tenant_take_rate,
    weighted_take_rate,
    current_timestamp as dbt_updated_at
from tenant_take_rates

