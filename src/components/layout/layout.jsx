function layout({ children }) {
  return (
    <div className=" flex-col h-full w-full p-2.5 items-center justify-center gap-3">
      {children}
    </div>
  );
}

export default layout;
