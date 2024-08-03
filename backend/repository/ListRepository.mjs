import { EnumIdentification } from "./database.mjs";

export class ListRepository {
  /**
   * @returns {{
   *   id: number;
   *   code: string;
   * }[]} identifications
   */
  static Identifications() {
    return EnumIdentification.find().map((identification) => {
      return {
        id: identification._id,
        code: identification.code
      };
    });
  }
}
