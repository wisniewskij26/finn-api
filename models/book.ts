import { URL } from "url";
import * as gb from "../utils/googleBooks";
import { Volume, SearchOptions } from "../utils/googleBooks";

function formatCoverURL(original: string) {
  if (original) {
    const url = new URL(original);
    url.searchParams.delete("edge");
    return url.toString();
  }
}

class Book {
  public static async findByID(id: string) {
    const volume = await gb.getVolumeByID(id);
    return Book.fromVolume(volume);
  }

  public static fromVolume(volume: Volume) {
    return {
      id: volume.id,
      title: volume.volumeInfo.title || "",
      subtitle: volume.volumeInfo.subtitle,
      authors: volume.volumeInfo.authors,
      publisher: volume.volumeInfo.publisher,
      categories: volume.volumeInfo.categories,
      covers: {
        thumbnail: formatCoverURL(volume.volumeInfo.imageLinks.thumbnail),
        small: formatCoverURL(volume.volumeInfo.imageLinks.small),
        medium: formatCoverURL(volume.volumeInfo.imageLinks.medium),
        large: formatCoverURL(volume.volumeInfo.imageLinks.large),
        smallThumbnail: formatCoverURL(
          volume.volumeInfo.imageLinks.smallThumbnail
        ),
        extraLarge: formatCoverURL(volume.volumeInfo.imageLinks.extraLarge)
      }
    };
  }

  public static async search(query: string, options?: SearchOptions) {
    const results = await gb.search(query, options);

    return results.items.map(item => Book.fromVolume(item));
  }

  public id: string;
  public title: string;
  public subtitle: string;
  public authors: string[];
  public publisher: string;
  public categories: string[];
  public covers: {
    thumbnail: string;
    small: string;
    medium: string;
    large: string;
    smallThumbnail: string;
    extraLarge: string;
  };
}

export default Book;
