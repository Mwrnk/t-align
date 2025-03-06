import arrowDownIcon from '../../assets/icons/CaretDown.svg';
function dropdown() {
  return (
    <div className="flex p-2.5 bg-charcoal border-1 border-steel rounded-xl text-white gap-3 cursor-pointer">
      All priorities
      <img src={arrowDownIcon}></img>
    </div>
  );
}

export default dropdown;
