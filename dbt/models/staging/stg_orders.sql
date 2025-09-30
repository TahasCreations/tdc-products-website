-- Staging model for orders data
with source_data as (
    select
        order_id,
        tenant_id,
        customer_id,
        seller_id,
        status,
        total_amount,
        commission_amount,
        take_rate,
        gmv,
        currency,
        created_at,
        updated_at,
        order_date,
        order_hour,
        order_day_of_week,
        order_month,
        order_year
    from {{ source('raw', 'orders') }}
),

cleaned_data as (
    select
        order_id,
        tenant_id,
        customer_id,
        seller_id,
        status,
        total_amount,
        commission_amount,
        take_rate,
        gmv,
        currency,
        created_at,
        updated_at,
        order_date,
        order_hour,
        order_day_of_week,
        order_month,
        order_year,
        
        -- Add computed fields
        case 
            when status in ('COMPLETED', 'PAID', 'SETTLED') then true
            else false
        end as is_completed,
        
        case 
            when status = 'CANCELLED' then true
            else false
        end as is_cancelled,
        
        case 
            when total_amount >= 1000 then 'high_value'
            when total_amount >= 100 then 'medium_value'
            else 'low_value'
        end as order_value_tier,
        
        -- Calculate net revenue (GMV - commission)
        total_amount - commission_amount as net_revenue,
        
        -- Calculate commission percentage
        case 
            when total_amount > 0 then (commission_amount / total_amount) * 100
            else 0
        end as commission_percentage
    from source_data
)

select * from cleaned_data

