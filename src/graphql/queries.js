/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const ListBMSUsers = /* GraphQL */ `
  query ListBMSUsers($input: ListBMSUsersInput) {
    ListBMSUsers(input: $input)
  }
`;
export const GetCurrentUserDetails = /* GraphQL */ `
  query GetCurrentUserDetails {
    GetCurrentUserDetails
  }
`;
export const ListOrganizations = /* GraphQL */ `
  query ListOrganizations {
    ListOrganizations
  }
`;
export const ListOrganizationsDailyReport = /* GraphQL */ `
  query ListOrganizationsDailyReport(
    $input: ListOrganizationsDailyReportInput
  ) {
    ListOrganizationsDailyReport(input: $input)
  }
`;
export const listSpecializations = /* GraphQL */ `
  query ListSpecializations {
    listSpecializations
  }
`;
export const ListPOVsByType = /* GraphQL */ `
  query ListPOVsByType($input: ListPOVsByTypeInput) {
    ListPOVsByType(input: $input)
  }
`;
export const ListDevices = /* GraphQL */ `
  query ListDevices {
    ListDevices
  }
`;
export const ListOrganizationsAuditLogs = /* GraphQL */ `
  query ListOrganizationsAuditLogs($input: ListOrganizationsAuditLogsInput) {
    ListOrganizationsAuditLogs(input: $input) {
      data {
        items {
          log_id
          log_action
          log_source
          log_type
          logged_by
          logged_on
          organization_id
          __typename
        }
        __typename
      }
      status
      __typename
    }
  }
`;
export const ListOrganizationUsers = /* GraphQL */ `
  query ListOrganizationUsers($input: ListUsersInput) {
    ListOrganizationUsers(input: $input)
  }
`;
export const ListOrganizationPOVs = /* GraphQL */ `
  query ListOrganizationPOVs($input: ListOrganizationPOVsInput) {
    ListOrganizationPOVs(input: $input)
  }
`;
export const ListOrganizationProducts = /* GraphQL */ `
  query ListOrganizationProducts($input: ListOrganizationProductsInput) {
    ListOrganizationProducts(input: $input)
  }
`;
export const ListVisitLogsOfOrganization = /* GraphQL */ `
  query ListVisitLogsOfOrganization($input: ListVisitLogsOfOrganizationInput) {
    ListVisitLogsOfOrganization(input: $input) {
      status
      next_token
      data {
        Items {
          visit_log_id
          pov_id
          comments
          pov_name
          pov_type
          organization_id
          pov_country_code
          pov_contact_number
          pov_location {
            lat
            lng
            __typename
          }
          pov_category_name
          pov_visited_on
          pov_last_visited_on
          pov_unique_display_id
          pov_address
          pov_promoted_drugs {
            catalog_id
            catalog_name
            __typename
          }
          user_id
          accompanied_by_user_id
          accompanied_by_user_name
          accompanied_user_designation_name
          user_name
          target
          user_employee_id
          designation
          pov_territories
          manager_feedback
          admin_or_manager_id
          secondary_reporter_id
          current_month
          items_given_list {
            product_id
            product_name
            setting_id
            available_units
            setting_date
            cme_topic
            setting_type
            cme_stage
            gift_name
            gift_count
            leave_behind_name
            leave_behind_count
            sample_count
            pov_conversion
            __typename
          }
          secondary_reporter_name
          primary_sales_value
          secondary_sales_value
          hospital_pov_id
          hospital_name
          territory_names
          territory_categories
          territory_hq
          d_o_j
          employee_id
          secondary_reporter_email_id
          admin_or_manager_name
          admin_or_manager_email_id
          specialization_name
          feedback
          visit_log_status
          pov_s3_document
          customer_engagement_details
          __typename
        }
        __typename
      }
      __typename
    }
  }
`;
export const ListOrganizationTerritories = /* GraphQL */ `
  query ListOrganizationTerritories($input: ListOrganizationTerritoriesInput) {
    ListOrganizationTerritories(input: $input)
  }
`;
export const ListOrganizationsModuleAccess = /* GraphQL */ `
  query ListOrganizationsModuleAccess(
    $input: ListOrganizationsModuleAccessInput
  ) {
    ListOrganizationsModuleAccess(input: $input)
  }
`;
export const ListTutorialFiles = /* GraphQL */ `
  query ListTutorialFiles {
    ListTutorialFiles
  }
`;
export const ListVisitLogByTime = /* GraphQL */ `
  query ListVisitLogByTime($input: ListVisitLogByTimeInput) {
    ListVisitLogByTime(input: $input)
  }
`;
export const ListAuditLogs = /* GraphQL */ `
  query ListAuditLogs($input: ListAuditLogsInput) {
    ListAuditLogs(input: $input)
  }
`;
export const ListAllDesignation = /* GraphQL */ `
  query ListAllDesignation($input: ListAllDesignationInput) {
    ListAllDesignation(input: $input)
  }
`;
export const ListUsersOfOrganization = /* GraphQL */ `
  query ListUsersOfOrganization($input: ListUsersOfOrganizationInput) {
    ListUsersOfOrganization(input: $input)
  }
`;
export const ListNotificationsSettings = /* GraphQL */ `
  query ListNotificationsSettings($input: ListNotificationsSettingsInput) {
    ListNotificationsSettings(input: $input)
  }
`;
export const ListPOVs = /* GraphQL */ `
  query ListPOVs($input: ListPOVsInput) {
    ListPOVs(input: $input)
  }
`;
export const ListBulkUploadAuditLogs = /* GraphQL */ `
  query ListBulkUploadAuditLogs($input: ListBulkUploadAuditLogsInput) {
    ListBulkUploadAuditLogs(input: $input)
  }
`;
export const OrganizationDashboard = /* GraphQL */ `
  query OrganizationDashboard($input: organizationIdInput) {
    OrganizationDashboard(input: $input)
  }
`;
export const ListUserAttendanceHistory = /* GraphQL */ `
  query ListUserAttendanceHistory($input: ListAttendanceHistoryInput) {
    ListUserAttendanceHistory(input: $input)
  }
`;
export const ListAllCatalogs = /* GraphQL */ `
  query ListAllCatalogs($input: ListAllCatalogsInput) {
    ListAllCatalogs(input: $input)
  }
`;
export const ListPOVRemarks = /* GraphQL */ `
  query ListPOVRemarks($input: ListPOVRemarksInput) {
    ListPOVRemarks(input: $input)
  }
`;
export const ListPOVConversionReport = /* GraphQL */ `
  query ListPOVConversionReport($input: ListPOVConversionReportInput) {
    ListPOVConversionReport(input: $input)
  }
`;
export const ListAllEDetailLogs = /* GraphQL */ `
  query ListAllEDetailLogs($input: ListAllEDetailLogsInput) {
    ListAllEDetailLogs(input: $input)
  }
`;
export const ListScheduledCMEs = /* GraphQL */ `
  query ListScheduledCMEs($input: ListScheduledCMEsInput) {
    ListScheduledCMEs(input: $input)
  }
`;
export const GetOrganizationsMonthlyReports = /* GraphQL */ `
  query GetOrganizationsMonthlyReports(
    $input: GetOrganizationsMonthlyReportsInput
  ) {
    GetOrganizationsMonthlyReports(input: $input)
  }
`;
export const ListUserOtps = /* GraphQL */ `
  query ListUserOtps($input: ListUserOtpsInput) {
    ListUserOtps(input: $input)
  }
`;
