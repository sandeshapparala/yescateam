import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // Singleton document for 3D Carousel
      S.listItem()
        .title('3D Carousel')
        .id('carousel3d')
        .child(
          S.document()
            .schemaType('carousel3d')
            .documentId('carousel3d')
        ),
      // Other document types
      ...S.documentTypeListItems().filter(
        (listItem) => !['carousel3d'].includes(listItem.getId() || '')
      ),
    ])
