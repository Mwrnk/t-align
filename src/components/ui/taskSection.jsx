function taskSection(props) {
  return (
    <div className="flex-1 shrink-0 basis-0  p-2.5 flex-col justify-center items-center gap-3 self-stretch rounded-xl bg-charcoal">
      <div className="font-title text-center">
        <h1>{props.title}</h1>
      </div>
      <div>{props.children}</div>
    </div>
  );
}

export default taskSection;
