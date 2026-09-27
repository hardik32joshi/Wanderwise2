import ActivityForm from '../ActivityForm';

export default function NewActivityPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">New Activity</h1>
      <ActivityForm id={null} />
    </div>
  );
}
