-- Daily GMV (Gross Merchandise Value) fact table
with daily_orders as (
    select
        tenant_id,
        order_date,
        order_year,
        order_month,
        order_day_of_week,
        count(distinct order_id) as total_orders,
        count(distinct customer_id) as unique_customers,
        count(distinct seller_id) as unique_sellers,
        sum(gmv) as total_gmv,
        sum(commission_amount) as total_commission,
        sum(net_revenue) as total_net_revenue,
        avg(take_rate) as avg_take_rate,
        avg(commission_percentage) as avg_commission_percentage,
        sum(case when is_completed then gmv else 0 end) as completed_gmv,
        sum(case when is_cancelled then gmv else 0 end) as cancelled_gmv,
        count(case when is_completed then 1 end) as completed_orders,
        count(case when is_cancelled then 1 end) as cancelled_orders
    from {{ ref('stg_orders') }}
    group by 1, 2, 3, 4, 5
),

daily_metrics as (
    select
        *,
        -- Calculate completion rate
        case 
            when total_orders > 0 then (completed_orders::float / total_orders) * 100
            else 0
        end as completion_rate,
        
        -- Calculate cancellation rate
        case 
            when total_orders > 0 then (cancelled_orders::float / total_orders) * 100
            else 0
        end as cancellation_rate,
        
        -- Calculate average order value
        case 
            when total_orders > 0 then total_gmv / total_orders
            else 0
        end as avg_order_value,
        
        -- Calculate GMV per customer
        case 
            when unique_customers > 0 then total_gmv / unique_customers
            else 0
        end as gmv_per_customer,
        
        -- Calculate GMV per seller
        case 
            when unique_sellers > 0 then total_gmv / unique_sellers
            else 0
        end as gmv_per_seller
    from daily_orders
)

select
    tenant_id,
    order_date,
    order_year,
    order_month,
    order_day_of_week,
    total_orders,
    unique_customers,
    unique_sellers,
    total_gmv,
    total_commission,
    total_net_revenue,
    avg_take_rate,
    avg_commission_percentage,
    completed_gmv,
    cancelled_gmv,
    completed_orders,
    cancelled_orders,
    completion_rate,
    cancellation_rate,
    avg_order_value,
    gmv_per_customer,
    gmv_per_seller,
    current_timestamp as dbt_updated_at
from daily_metrics

