type Props = {
  loadingText: string;
};

function Loading({ loadingText }: Props) {
  return <span aria-busy="true">{loadingText}</span>;
}

export default Loading;
