export interface CreateQnaDTO {
  question: string;
  answer: string;
}

export interface CreateCoverletterDTO {
  memberId: number;
  corporateName: string;
  jobName: string;
  qnaDTOList: CreateQnaDTO[];
}

export interface ApiResponseCreateCoverletterDTO {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  result?: CreateCoverletterDTO;
}

export interface QnaDTO {
  question?: string;
  answer?: string;
}

export interface CoverletterDetailDTO {
  coverletterId?: number;
  corporateName?: string;
  jobName?: string;
  createdAt?: string;
  qnaList?: QnaDTO[];
}

export interface ApiResponseCoverletterDetailDTO {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  result?: CoverletterDetailDTO;
}

export interface MyCoverletterDTO {
  coverletterId?: number;
  corporateName?: string;
  jobName?: string;
  createdAt?: string;
}

export interface MyCoverletterListDTO {
  coverletters?: MyCoverletterDTO[];
}

export interface ApiResponseMyCoverletterListDTO {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  result?: MyCoverletterListDTO;
}
