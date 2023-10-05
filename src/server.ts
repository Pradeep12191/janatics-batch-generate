import 'module-alias/register'; // for production build
import 'tsconfig-paths/register'; // for local development

import debug from 'debug';
import { initSchedule, runBatchMonitor, socket, tasks } from '@helpers/core';
import { BatchGenerateMonitorModel } from '@oracle-models/jan/batch_generate_monitor';
import { Op } from 'sequelize';
const debugNode = debug("node-angular");

initSchedule()
BatchGenerateMonitorModel.sync();
(async () => {
  runBatchMonitor('1001')
})()

console.log('Batch Generation Initialized.')
process.stdin.resume();



