import type { Model } from "mongoose";
import { apiFeature } from "../../../utils/apiFeature";
import { ActivityLog } from "./activity.schema";

type getOneOptions = {
	fields?: string;
	populate?: string;
};

class ActivityService {
	private mongooseModel: Model<any>;
	constructor() {
		this.mongooseModel = ActivityLog;
	}

	createOne(data) {
		return this.mongooseModel.create(data);
	}

	async deleteOne(id: string) {
		const document = (await this.mongooseModel.findById(id)) as any;
		if (!document) throw new Error("Document not found");

		if (document.deleted)
			return this.mongooseModel.findByIdAndUpdate(id, { $set: { deleted: true } });
		return this.mongooseModel.findByIdAndDelete(id);
	}

	async updateOne(id: string, data:any){
		const document = await this.mongooseModel.findById(id).exec();
		if (!document) throw new Error("Document not found");
		return await this.mongooseModel.findByIdAndUpdate(id, data, { new: true }).exec();
	}

	async getOne(id: string, getOneOptions?: getOneOptions) {
		const document = await this.mongooseModel.findById(id);
		if (!document) throw new Error("Document not found");
		let query = this.mongooseModel.findById(id);

		if (getOneOptions?.fields) {
			query = query.select(getOneOptions.fields);
		}

		if (getOneOptions?.populate) {
			query = query.populate(getOneOptions.populate);
		}

		return query.lean().exec();
	}
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async getAll(querystring?: Record<string, any>) {
		const schema = this.mongooseModel.schema;
		const filter = {};
		if (schema.paths.deleted) filter["deleted"] = false;

		const mongoQuery = this.mongooseModel.find(filter);

		const { paginationResult, MongooseQuery } = await new apiFeature(mongoQuery, querystring)
			.sort()
			.filter()
			.select()
			.paginate();

		const data = await MongooseQuery.exec();
		return { paginationResult, data };
	}
}

export default new ActivityService();
