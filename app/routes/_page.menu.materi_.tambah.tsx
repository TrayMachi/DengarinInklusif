import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from 'react-router';
import { MateriTambahkanModule } from '~/modules/MateriTambahkanModule';
import { MateriTambahkanAction } from '~/modules/MateriTambahkanModule/action';
import { MateriTambahkanLoader } from '~/modules/MateriTambahkanModule/loader';

export async function loader(args: LoaderFunctionArgs) {
  return MateriTambahkanLoader(args);
}

export async function action(args: ActionFunctionArgs) {
  return MateriTambahkanAction(args);
}

export default function MateriTambahkanPage() {
  return <MateriTambahkanModule />;
}
