import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from 'react-router';
import { SettingModule } from '~/modules/SettingModule';
import { SettingAction } from '~/modules/SettingModule/action';
import { SettingLoader } from '~/modules/SettingModule/loader';

export async function loader(args: LoaderFunctionArgs) {
  return SettingLoader(args);
}

export async function action(args: ActionFunctionArgs) {
  return SettingAction(args);
}

export default function SettingPage() {
  return <SettingModule />;
}
