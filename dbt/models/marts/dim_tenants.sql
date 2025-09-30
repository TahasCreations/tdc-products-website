-- Tenant dimension table
with tenant_data as (
    select distinct
        tenant_id,
        order_date,
        order_year,
        order_month
    from {{ ref('stg_orders') }}
),

tenant_metrics as (
    select
        tenant_id,
        min(order_date) as first_order_date,
        max(order_date) as last_order_date,
        count(distinct order_date) as active_days,
        count(distinct order_year) as active_years,
        count(distinct order_month) as active_months
    from tenant_data
    group by 1
),

tenant_tiers as (
    select
        *,
        case 
            when active_days >= 365 then 'enterprise'
            when active_days >= 90 then 'professional'
            when active_days >= 30 then 'standard'
            else 'starter'
        end as tenant_tier,
        
        case 
            when active_days >= 365 then 'mature'
            when active_days >= 90 then 'established'
            when active_days >= 30 then 'growing'
            else 'new'
        end as tenant_lifecycle_stage
    from tenant_metrics
)

select
    tenant_id,
    first_order_date,
    last_order_date,
    active_days,
    active_years,
    active_months,
    tenant_tier,
    tenant_lifecycle_stage,
    current_timestamp as dbt_updated_at
from tenant_tiers

