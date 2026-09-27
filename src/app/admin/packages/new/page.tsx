import PackageForm from '../PackageForm';

export default function NewPackagePage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">New Package</h1>
      <PackageForm id={null} />
    </div>
  );
}
