import editIcon from '../../assets/icons/PencilSimpleLine.svg';
import removeIcon from '../../assets/icons/Trash.svg';
function taskCard() {
  return (
    <div className="flex flex-col m-3 p-6 items-start gap-3 bg-steel rounded-xl shadow-xl">
      <div className="flex w-full justify-between items-center gap-3">
        Title
        <div className="flex gap-3 justify-center items-center">
          <img src={editIcon} className="w-6 h-6" />
          <img src={removeIcon} className="w-6 h-6" />
        </div>
      </div>
      <div>
        <p className="font-text">
          Create wireframes for the task management app
        </p>
      </div>
      <div className="flex gap-3 bg-red-300 p-2 rounded-xl">
        <p className="font-text text-red-700 ">High</p>
      </div>
      <p className="font-text text-light-steel">Created: 04/03/2025</p>
    </div>
  );
}

export default taskCard;
