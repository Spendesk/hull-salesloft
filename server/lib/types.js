/* @flow */
import type {
  HullAccount,
  HullUserIdent,
  HullAccountIdent,
  HullUserAttributes,
  HullAccountAttributes,
  HullUser
} from "hull";

/*
 *** Hull Types. Replace when 0.14.0 is released
 */

export type HullMetrics = {
  increment(name: string, value: number, ...params: any[]): void,
  value(name: string, value: number, ...params: any[]): void
};

export type HullClientLogger = {
  log(message: ?any, ...optionalParams: any[]): void,
  info(message: ?any, ...optionalParams: any[]): void,
  warn(message: ?any, ...optionalParams: any[]): void,
  error(message: ?any, ...optionalParams: any[]): void,
  debug(message: ?any, ...optionalParams: any[]): void
};

export type HullClientConfiguration = {
  prefix: string,
  domain: string,
  protocol: string,
  id: string,
  secret: string,
  organization: string,
  version: string
};

export type HullClientApiOptions = {
  timeout: number,
  retry: number
};

export type HullClientUtilTraits = {
  group(user: HullUser | HullAccount): Object,
  normalize(traits: Object): HullUserAttributes
};

export type HullClientUtils = {
  traits: HullClientUtilTraits
};

export type HullClientTraitsContext = {
  source: string
};

export type HullFieldDropdownItem = {
  value: string,
  label: string
};

/**
 * This is an event name which we use when tracking an event
 */
export type HullEventName = string;

/**
 * This is are event's properties which we use when tracking an event
 */
export type HullEventProperties = {
  [HullEventProperty: string]: string
};

/**
 * This is additional context passed with event
 */
export type HullEventContext = {
  location?: {},
  page?: {
    referrer?: string
  },
  referrer?: {
    url: string
  },
  os?: {},
  useragent?: string,
  ip?: string | number
};

export type HullClient = {
  configuration: HullClientConfiguration,
  asUser(ident: HullUserIdent): HullClient,
  asAccount(ident: HullAccountIdent): HullClient,
  logger: HullClientLogger,
  traits(
    attributes: HullUserAttributes | HullAccountAttributes,
    context: HullClientTraitsContext
  ): Promise<any>, // Needs to be refined further
  track(
    event: string,
    properties: HullEventProperties,
    context: HullEventContext
  ): Promise<any>,
  get(
    url: string,
    params?: Object,
    options?: HullClientApiOptions
  ): Promise<any>,
  post(
    url: string,
    params?: Object,
    options?: HullClientApiOptions
  ): Promise<any>,
  put(
    url: string,
    params?: Object,
    options?: HullClientApiOptions
  ): Promise<any>,
  del(
    url: string,
    params?: Object,
    options?: HullClientApiOptions
  ): Promise<any>,
  account(ident: HullAccountIdent): HullClient,
  utils: HullClientUtils
};

/*
 *** Salesloft Types, specific to this connector
 */

export type SalesloftConnectorSettings = {
  api_key: string,
  account_attributes_inbound: Array<string>,
  person_attributes_inbound: Array<string>,
  account_last_sync_at: number,
  person_last_sync_at: number
};

export type SalesloftClientConfiguration = {
  baseApiUrl: string,
  hullMetric: HullMetrics,
  hullLogger: HullClientLogger,
  apiKey: string
};

export type SalesloftMappingConfiguration = {
  accountAttributesInbound: Array<string>,
  personAttributesInbound: Array<string>
};

export type SalesloftFieldDefinition = {
  id: string,
  label: string,
  key: string
};

export type SalesloftListQuery = {
  [string]: any
};

export type SalesloftListBody<T> = {
  body: SalesloftListResponse<T>
};

export type SalesloftListResponse<T> = {
  data: Array<T>
};

export type SalesloftPropertyRead = {
  id: number
};

export type SalesloftPersonCountsRead = {
  emails_sent: number,
  emails_viewed: number,
  emails_clicked: number,
  emails_replied_to: number,
  emails_bounced: number,
  calls: number
};

export type SalesloftPersonRead = {
  id: number,
  created_at: DateTime,
  updated_at: DateTime,
  last_contacted_at?: DateTime,
  last_replied_at?: DateTime,
  first_name: string,
  last_name: string,
  display_name: string,
  email_address: string,
  secondary_email_address?: string,
  personal_email_address?: string,
  phone?: string,
  phone_extension?: string,
  home_phone?: string,
  mobile_phone?: string,
  linkedin_url?: string,
  title?: string,
  city?: string,
  state?: string,
  country?: string,
  work_city?: string,
  work_state?: string,
  work_country?: string,
  crm_url?: string,
  crm_id?: string,
  crm_object_type?: string,
  owner_crm_id?: string,
  person_company_name?: string,
  person_company_website?: string,
  do_not_contact: boolean,
  bouncing: boolean,
  locale?: string,
  personal_website?: string,
  twitter_handle?: string,
  last_contacted_type?: string,
  import?: string,
  tags: Array<string>,
  counts: SalesloftPersonCountsRead,
  account?: SalesloftPropertyRead,
  owner?: SalesloftPropertyRead,
  last_contacted_by?: SalesloftPropertyRead,
  person_stage?: SalesloftPropertyRead
};

export type SalesloftAccountCountsRead = {
  people: number
};

export type SalesloftAccountRead = {
  id: number,
  created_at: DateTime,
  updated_at: DateTime,
  archived_at?: DateTime,
  name: string,
  domain: string,
  conversational_name?: string,
  description?: string,
  phone?: string,
  website?: string,
  linkedin_url?: string,
  twitter_handle?: string,
  street?: string,
  city?: string,
  state?: string,
  postal_code?: string,
  country?: string,
  locale?: string,
  industry?: string,
  company_type?: string,
  founded?: number,
  revenue_range?: string,
  size?: number,
  crm_id?: string,
  crm_url?: string,
  crm_object_type?: string,
  owner_crm_id?: string,
  last_contacted_at?: DateTime,
  last_contacted_type?: string,
  do_not_contact?: boolean,
  tags: Array<string>,
  counts: SalesloftAccountCountsRead,
  owner?: SalesloftPropertyRead,
  creator?: SalesloftPropertyRead,
  last_contacted_by?: SalesloftPropertyRead,
  last_contacted_person?: SalesloftPropertyRead,
  company_stage?: SalesloftPropertyRead
};
