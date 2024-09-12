/* eslint-disable no-process-env */
import { Context } from 'aws-lambda';
import { handler } from './index';
import { createMockedLinkedinProfileRequest } from './test/mocks/linkedin-profile.mocks';
import { createMockedSqsSEvent } from './test/mocks/sqs.mocks';
import { logger } from './util/logger';

// 👉 Fake manual execution without AWS: For local debug
void (async (): Promise<void> => {
  const profileApiToken = process.env['LOCAL_PROFILE_API_TOKEN'];
  const request = createMockedLinkedinProfileRequest({ profileApiToken });
  const fakeEvent = createMockedSqsSEvent(request);

  logger.info('👉 [launch.ts] Debugging lambda handler  ...');
  await handler(fakeEvent, {} as Context, () => {
    logger.info('✅ [launch.ts] Executed handler');
  });
})();
