//import { ReferenceFeatures } from "../../enums";

import { ExpensesFeatures } from "../../enums";

export class ExpensesFeatureFilesReqModel {
  featuresRefId: number;
  featuresRefName: ExpensesFeatures;

  constructor(featuresRefId: number,
    featuresRefName: ExpensesFeatures
  ) {
    this.featuresRefId = featuresRefId;
    this.featuresRefName = featuresRefName;
  }
}