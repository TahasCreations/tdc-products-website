-- Monthly GMV aggregation
with monthly_gmv as (
    select
        tenant_id,
        order_year,
        order_month,
        sum(total_gmv) as monthly_gmv,
        sum(total_commission) as monthly_commission,
        sum(total_net_revenue) as monthly_net_revenue,
        sum(total_orders) as monthly_orders,
        sum(unique_customers) as monthly_unique_customers,
        sum(unique_sellers) as monthly_unique_sellers,
        avg(avg_take_rate) as monthly_avg_take_rate,
        avg(completion_rate) as monthly_completion_rate,
        avg(avg_order_value) as monthly_avg_order_value
    from {{ ref('fct_gmv_daily') }}
    group by 1, 2, 3
),

monthly_growth as (
    select
        *,
        lag(monthly_gmv) over (partition by tenant_id order by order_year, order_month) as prev_month_gmv,
        lag(monthly_orders) over (partition by tenant_id order by order_year, order_month) as prev_month_orders,
        lag(monthly_commission) over (partition by tenant_id order by order_year, order_month) as prev_month_commission
    from monthly_gmv
),

monthly_metrics as (
    select
        *,
        -- Calculate month-over-month growth rates
        case 
            when prev_month_gmv > 0 then ((monthly_gmv - prev_month_gmv) / prev_month_gmv) * 100
            else null
        end as gmv_growth_rate,
        
        case 
            when prev_month_orders > 0 then ((monthly_orders - prev_month_orders) / prev_month_orders) * 100
            else null
        end as orders_growth_rate,
        
        case 
            when prev_month_commission > 0 then ((monthly_commission - prev_month_commission) / prev_month_commission) * 100
            else null
        end as commission_growth_rate,
        
        -- Calculate commission efficiency
        case 
            when monthly_gmv > 0 then (monthly_commission / monthly_gmv) * 100
            else 0
        end as commission_efficiency
    from monthly_growth
)

select
    tenant_id,
    order_year,
    order_month,
    monthly_gmv,
    monthly_commission,
    monthly_net_revenue,
    monthly_orders,
    monthly_unique_customers,
    monthly_unique_sellers,
    monthly_avg_take_rate,
    monthly_completion_rate,
    monthly_avg_order_value,
    gmv_growth_rate,
    orders_growth_rate,
    commission_growth_rate,
    commission_efficiency,
    current_timestamp as dbt_updated_at
from monthly_metrics

