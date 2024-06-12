import BarchartComponent from "./barchart";
import Task_progress_timer from "./task_progress_timer";

export default function Index() {
  return (
    <section>
      <Task_progress_timer />
      <BarchartComponent />
    </section>
  );
}
