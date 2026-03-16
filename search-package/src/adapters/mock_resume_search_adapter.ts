import { ResumeSearchAdapter, ResumeSearchRequest, ResumeSearchResponse } from './types';

export class MockResumeSearchAdapter implements ResumeSearchAdapter {
  constructor(private readonly handler: (req: ResumeSearchRequest) => ResumeSearchResponse | Promise<ResumeSearchResponse>) {}

  async search(request: ResumeSearchRequest): Promise<ResumeSearchResponse> {
    return this.handler(request);
  }
}
