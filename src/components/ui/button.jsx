import addIcon from '../../assets/icons/PlusCircle.svg';

function button() {
  return (
    <div className="flex p-2.5 bg-steel-blue rounded-xl text-white gap-3 cursor-pointer hover:bg-steel-blue-dark">
      Add Task
      <img src={addIcon} alt="addIcon" />
    </div>
  );
}

export default button;
