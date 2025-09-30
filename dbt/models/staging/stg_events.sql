-- Staging model for events data
with source_data as (
    select
        event_id,
        tenant_id,
        event_type,
        event_version,
        source,
        data,
        metadata,
        status,
        processed_at,
        error_message,
        created_at,
        updated_at,
        event_date,
        event_hour,
        event_day_of_week,
        event_month,
        event_year
    from {{ source('raw', 'events') }}
),

cleaned_data as (
    select
        event_id,
        tenant_id,
        event_type,
        event_version,
        source,
        data,
        metadata,
        status,
        processed_at,
        error_message,
        created_at,
        updated_at,
        event_date,
        event_hour,
        event_day_of_week,
        event_month,
        event_year,
        -- Add computed fields
        case 
            when event_type like 'order.%' then 'order'
            when event_type like 'product.%' then 'product'
            when event_type like 'customer.%' then 'customer'
            when event_type like 'seller.%' then 'seller'
            when event_type like 'payment.%' then 'payment'
            when event_type like 'settlement.%' then 'settlement'
            else 'other'
        end as event_category,
        
        case 
            when event_type in ('order.created', 'order.updated', 'order.completed', 'order.paid') then true
            else false
        end as is_business_critical,
        
        case 
            when status = 'PROCESSED' then true
            else false
        end as is_processed
    from source_data
)

select * from cleaned_data

