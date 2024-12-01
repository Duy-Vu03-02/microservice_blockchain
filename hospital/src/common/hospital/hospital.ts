import mongoose, { Schema, model } from 'mongoose';

export interface IHospitalId {
    id: string;
}

export interface IHospitalRegister {
    name: string;
    phone: string;
}

export interface IHospitalReponse {
    id: string;
    name: string;
    publicKey: string;
    phone: string;
}

export interface IHospital extends Document {
    _id: Schema.Types.ObjectId;
    name: String;
    phone: String;
    publicKey: String;
    privateKey: String;
    transform(): IHospitalReponse;
}

const HospitalSchema = new Schema<IHospital>(
    {
        name: { type: String },
        phone: { type: String },
        publicKey: { type: String },
        privateKey: { type: String },
    },
    {
        timestamps: true,
    },
);

HospitalSchema.method({
    transform(): IHospitalReponse {
        const transformed: IHospitalReponse = {
            id: this._id.toHexString(),
            name: this.name ?? undefined,
            phone: this.phone,
            publicKey: this.publicKey,
        };

        return transformed;
    },
});

export const HospitalModel = mongoose.model<IHospital>('Hospital', HospitalSchema);
