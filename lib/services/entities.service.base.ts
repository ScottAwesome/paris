import {DataEntityType} from "../entity/data-entity.base";
import {Field} from "../entity/entity-field";
import {EntityFields} from "../entity/entity-fields";
import {EntityConfigBase} from "../entity/entity-config.base";
import {entityFieldsService} from "./entity-fields.service";

export abstract class EntitiesServiceBase<T extends EntityConfigBase>{
	protected _allEntities:Map<DataEntityType, T> = new Map;

	get allEntities():Array<T>{
		return Array.from(this._allEntities.values());
	}

	getEntityByType(dataEntityType:DataEntityType):T{
		return this._allEntities.get(dataEntityType) || this._allEntities.get(dataEntityType.prototype);
	}

	addEntity(dataEntityType:DataEntityType, entity:T):T{
		if (!this._allEntities.has(dataEntityType))
			this._allEntities.set(dataEntityType, entity);

		entity.fields = this.getDataEntityTypeFields(dataEntityType);

		// TODO: Clear the fields once the entity is populated, without affecting inherited fields.

		return entity;
	}



	getEntityByPluralName(pluralName:string):DataEntityType{
		let allEntities:Array<DataEntityType> = Array.from(this._allEntities.keys()),
			pluralNameLowerCase = pluralName.toLowerCase();

		for(let i=0, entity:DataEntityType; entity = allEntities[i]; i++){
			if (entity.entityConfig.pluralName.toLowerCase() === pluralNameLowerCase)
				return entity;
		}

		return null;
	}

	private getDataEntityTypeFields(dataEntityType:DataEntityType):EntityFields{
		if (!dataEntityType)
			return null;

		let parentEntityDataType:DataEntityType = Object.getPrototypeOf(dataEntityType).prototype,
			parentEntity:T = this._allEntities.get(parentEntityDataType),
			parentDataTypeFields:EntityFields = parentEntity && parentEntity.fields || this.getDataEntityTypeFields(parentEntityDataType) || null;

		let fullDataEntityTypeFields:EntityFields = new Map;
		if (parentDataTypeFields)
			parentDataTypeFields.forEach((field:Field, fieldId:string) => fullDataEntityTypeFields.set(fieldId, field));

		let dataEntity:T = this.getEntityByType(dataEntityType);
		let dataEntityTypeFields:EntityFields = dataEntity && dataEntity.fields || entityFieldsService.getDataTypeFields(dataEntityType);

		if (dataEntityTypeFields)
			dataEntityTypeFields.forEach((field:Field, fieldId:string) => fullDataEntityTypeFields.set(fieldId, field));

		return fullDataEntityTypeFields;
	}
}