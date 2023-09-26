import { vi } from 'vitest'

// mock router for 'useParams'
vi.mock('react-router-dom');

vi.mock('antd', async () => {
  const antd = await vi.importActual('antd');
  // @ts-expect-error importActualの型付けをしていない
  antd.theme.defaultConfig.hashed = false;
  return antd;
});
