/* @flow */
import type {
  SalesloftMappingConfiguration,
  SalesloftFieldDefinition,
  SalesloftAccountRead,
  SalesloftPersonRead
} from "./types";

const _ = require("lodash");

const ACCOUNT_FIELDDEFS = require("./account-fielddefs");
const PERSON_FIELDDEFS = require("./person-fielddefs");

class SalesloftMapping {
  accountAttributesInbound: Array<string>;
  personAttributesInbound: Array<string>;

  constructor(config: SalesloftMappingConfiguration) {
    this.accountAttributesInbound = config.accountAttributesInbound;
    this.personAttributesInbound = config.personAttributesInbound;
  }

  mapSalesloftAccountToHull(salesloftAccount: SalesloftAccountRead) {
    const hullAccountAttributes = this.mapAttributes(
      salesloftAccount,
      this.accountAttributesInbound,
      ACCOUNT_FIELDDEFS
    );
    hullAccountAttributes["salesloft/archived_at"] = {
      value: _.get(salesloftAccount, "archived_at"),
      operation: "set"
    };
    hullAccountAttributes.name = {
      value: _.get(salesloftAccount, "name"),
      operation: "setIfNull"
    };
    hullAccountAttributes.domain = {
      value: _.get(salesloftAccount, "domain"),
      operation: "setIfNull"
    };

    return hullAccountAttributes;
  }

  mapSalesloftPersonToHull(salesloftPerson: SalesloftPersonRead) {
    const hullUserAttributes = this.mapAttributes(
      salesloftPerson,
      this.personAttributesInbound,
      PERSON_FIELDDEFS
    );
    hullUserAttributes.first_name = {
      value: _.get(salesloftPerson, "first_name"),
      operation: "setIfNull"
    };
    hullUserAttributes.last_name = {
      value: _.get(salesloftPerson, "last_name"),
      operation: "setIfNull"
    };
    hullUserAttributes.email = {
      value: _.get(salesloftPerson, "email"),
      operation: "setIfNull"
    };
    hullUserAttributes.phone = {
      value: _.get(salesloftPerson, "phone"),
      operation: "setIfNull"
    };

    return hullUserAttributes;
  }

  mapAttributes(
    salesloftObject: SalesloftAccountRead | SalesloftPersonRead,
    attributes: Array<string>,
    fieldDefinitions: Array<SalesloftFieldDefinition>
  ) {
    const hullAttributes = {};
    hullAttributes["salesloft/id"] = {
      value: _.get(salesloftObject, "id"),
      operation: "set"
    };
    hullAttributes["salesloft/created_at"] = {
      value: _.get(salesloftObject, "created_at"),
      operation: "set"
    };
    hullAttributes["salesloft/updated_at"] = {
      value: _.get(salesloftObject, "updated_at"),
      operation: "set"
    };

    _.each(attributes, attribute => {
      const key = this.getKeyAssociateToAttribute(attribute, fieldDefinitions);
      hullAttributes[`salesloft/${attribute}`] = {
        value: _.get(salesloftObject, key),
        operation: "set"
      };
    });

    return hullAttributes;
  }

  getKeyAssociateToAttribute(
    attribute: string,
    fieldDefinitions: Array<SalesloftFieldDefinition>
  ) {
    return _.get(
      _.filter(fieldDefinitions, fieldDefinition => {
        return fieldDefinition.id === attribute;
      }),
      "[0].key"
    );
  }
}

module.exports = SalesloftMapping;
