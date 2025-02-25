export interface GuardianFieldsResult {
  apiUrl: string;
  id: string;
  type: "article";
  sectionId: string;
  sectionName: string;
  webPublicationDate: string;
  webTitle: string;
  webUrl: string;
  fields: {
    trailText: string;
    byline: string;
    thumbnail: string;
  };
  isHosted: boolean;
  pillarId: string;
  pillarName: string;
}

interface GuardianFields {
  currentPage: number;
  orderBy: string;
  pageSize: number;
  pages: number;
  startIndex: number;
  status: string;
  total: number;
  userTier: "developer";
  results: GuardianFieldsResult[];
}

export interface GuardianApiResponse {
  data: {
    response: GuardianFields;
    status: string;
    totalResults: number;
  };
}
