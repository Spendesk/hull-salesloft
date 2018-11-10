/* @flow */
import type { SalesloftFieldDefinition } from "./types";

const ACCOUNT_FIELDDEFS: Array<SalesloftFieldDefinition> = [
  {
    label: "Name",
    id: "name",
    key: "name"
  },
  {
    label: "Domain",
    id: "domain",
    key: "domain"
  },
  {
    label: "Conversational name",
    id: "conversational_name",
    key: "conversational_name"
  },
  {
    label: "Description",
    id: "description",
    key: "description"
  },
  {
    label: "Phone",
    id: "phone",
    key: "phone"
  },
  {
    label: "Website",
    id: "website",
    key: "website"
  },
  {
    label: "Linkedin url",
    id: "linkedin_url",
    key: "linkedin_url"
  },
  {
    label: "Twitter handle",
    id: "twitter_handle",
    key: "twitter_handle"
  },
  {
    label: "Street",
    id: "street",
    key: "street"
  },
  {
    label: "City",
    id: "city",
    key: "city"
  },
  {
    label: "State",
    id: "state",
    key: "state"
  },
  {
    label: "Postal code",
    id: "postal_code",
    key: "postal_code"
  },
  {
    label: "Country",
    id: "country",
    key: "country"
  },
  {
    label: "Locale",
    id: "locale",
    key: "locale"
  },
  {
    label: "Industry",
    id: "industry",
    key: "industry"
  },
  {
    label: "Company type",
    id: "company_type",
    key: "company_type"
  },
  {
    label: "Founded",
    id: "founded",
    key: "founded"
  },
  {
    label: "Revenue range",
    id: "revenue_range",
    key: "revenue_range"
  },
  {
    label: "Size",
    id: "size",
    key: "size"
  },
  {
    label: "CRM ID",
    id: "crm_id",
    key: "crm_id"
  },
  {
    label: "CRM url",
    id: "crm_url",
    key: "crm_url"
  },
  {
    label: "CRM object type",
    id: "crm_object_type",
    key: "crm_object_type"
  },
  {
    label: "Owner CRM ID",
    id: "owner_crm_id",
    key: "owner_crm_id"
  },
  {
    label: "Last contacted at",
    id: "last_contacted_at",
    key: "last_contacted_at"
  },
  {
    label: "Last contacted type",
    id: "last_contacted_type",
    key: "last_contacted_type"
  },
  {
    label: "Do not contact",
    id: "do_not_contact",
    key: "do_not_contact"
  },
  {
    label: "Tags",
    id: "tags",
    key: "tags"
  },
  {
    label: "People count",
    id: "people_count",
    key: "counts.people"
  },
  {
    label: "Owner ID",
    id: "owner_id",
    key: "owner.id"
  },
  {
    label: "Creator ID",
    id: "creator_id",
    key: "creator.id"
  },
  {
    label: "Last contacted by ID",
    id: "last_contacted_by_id",
    key: "last_contacted_by.id"
  },
  {
    label: "Last contacted person ID",
    id: "last_contacted_person_id",
    key: "last_contacted_person.id"
  },
  {
    label: "Company stage ID",
    id: "company_stage_id",
    key: "company_stage.id"
  }
];

module.exports = ACCOUNT_FIELDDEFS;
