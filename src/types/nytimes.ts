export interface NyTimesResponseDoc {
  abstract: string;
  web_url: string;
  snippet: string;
  lead_paragraph: string;
  multimedia: {
    rank: number;
    subtype: string;
    caption?: string | null;
    credit?: string | null;
    type: "image";
    url: string;
    height: number;
    width: number;
    legacy: {
      xlarge: string;
      xlargewidth: number;
      xlargeheight: number;
    };
    subType: string;
    crop_name: string;
  }[];
  headline: {
    main: string;
    kicker?: string | null;
    content_kicker?: string | null;
    print_headline?: string | null;
    name?: string | null;
    seo?: string | null;
    sub?: string | null;
  };
  keywords: {
    name: string;
    value: string;
    rank: number;
    major: string;
  }[];
  pub_date: string;
  document_type: string;
  news_desk: string;
  section_name: string;
  byline: {
    original: string;
    person: [
      {
        firstname: string;
        middlename?: string | null;
        lastname: string;
        qualifier?: string | null;
        title?: string | null;
        role: string;
        organization: string;
        rank: number;
      }
    ];
    organization?: string | null;
  };
  type_of_material: string;
  _id: string;
  word_count: number;
  uri: string;
}

export interface NyTimesResponse {
  data: {
    status: string;
    copyright: string;
    response: {
      docs: Array<NyTimesResponseDoc>;
      meta: {
        hits: number;
        offset: number;
        time: number;
      };
    };
  };
}
