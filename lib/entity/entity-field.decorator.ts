import {DataEntityType} from "./data-entity.base";
import {FieldConfig} from "./entity-field.config";
import {entityFieldsService} from "../services/entity-fields.service";
import {Field} from "./entity-field";

export function EntityField(fieldConfig?:FieldConfig):PropertyDecorator {
	return function (entityPrototype: DataEntityType, propertyKey: string | symbol) {
		let propertyConstructor:Function = (<any>Reflect).getMetadata("design:type", entityPrototype, propertyKey);

		fieldConfig = fieldConfig || {};
		let field:Field = Object.assign({}, fieldConfig);
		if (!field.id)
			field.id = String(propertyKey);

		field.type = fieldConfig.arrayOf || propertyConstructor;
		field.isArray = propertyConstructor === Array;
		entityFieldsService.addField(entityPrototype, field);
	}
}
