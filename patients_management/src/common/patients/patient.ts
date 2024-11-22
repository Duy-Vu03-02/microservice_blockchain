import mongoose, { Schema, model } from 'mongoose';

export interface IPatientsId {
    id: string;
}

export interface IPatientsHistory {
    time: Date;
}

export interface IPatientsNewHistory {
    time: Date;
    id: string;
}

export interface IPatientsRegister {
    name: string;
    age: number;
    history: [IPatientsHistory];
}

export interface IPatientsReponse {
    id: string;
    name: string;
    age: number;
    history: [IPatientsHistory];
}

export interface IPatients extends Document {
    _id: Schema.Types.ObjectId;
    name: String;
    age: Number;
    history: [IPatientsHistory];

    transform(): IPatientsReponse;
}

const PatientsSchema = new Schema<IPatients>(
    {
        name: { type: String },
        age: { type: Number },
        history: [
            {
                time: { type: Date },
            },
        ],
    },
    {
        timestamps: true,
    },
);

PatientsSchema.method({
    transform(): IPatientsReponse {
        const transformed: IPatientsReponse = {
            id: this._id.toHexString(),
            name: this.name ?? undefined,
            age: this.age ?? undefined,
            history: this.history.map((item) => {
                return {
                    time: item.time,
                };
            }),
        };

        return transformed;
    },
});

export const PatientsModel = mongoose.model<IPatients>('Patient', PatientsSchema);
