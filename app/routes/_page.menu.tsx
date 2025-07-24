import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from 'react-router';
import { MenuModule } from '~/modules/DashboardModule';
import { MenuAction } from '~/modules/DashboardModule/action';
import { MenuLoader } from '~/modules/DashboardModule/loader';

export async function loader(args: LoaderFunctionArgs) {
  return MenuLoader(args);
}

export async function action(args: ActionFunctionArgs) {
  return MenuAction(args);
}

export default function DashboardPage() {
  return <MenuModule />;
}
