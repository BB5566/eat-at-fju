import { defineHandler } from 'void';
import { live } from '../src/live';

// GET 開 SSE 連線、POST 訂閱或取消訂閱
export const GET = defineHandler((c) => live.connect(c));
export const POST = defineHandler((c) => live.control(c));
