export type Page<P> = {
    page: {
      title: string,
      id: string,
    },
    props: P,
}