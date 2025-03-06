function input(props) {
  return (
    <div>
      <input
        className="flex p-2.5 border-1 rounded-xl bg-charcoal border-steel"
        type="text"
        placeholder={props.placeholder}
      />
    </div>
  );
}

export default input;
