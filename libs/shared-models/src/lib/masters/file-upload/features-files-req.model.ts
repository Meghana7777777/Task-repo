import { ReferenceFeatures } from "../../enums";

export class FeatureFilesReqModel {
    featuresRefId: number;
    featuresRefName: ReferenceFeatures;

    constructor(featuresRefId: number, featuresRefName: ReferenceFeatures) {
        this.featuresRefId = featuresRefId;
        this.featuresRefName = featuresRefName;
    }
}