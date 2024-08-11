import fs from "node:fs/promises";
import path from "node:path";
import { DIRNAME_PATH } from "../config.mjs";
import { userRepository } from "./userRepository.mjs";

export class testRepository {
  /**
   * @param {{
   *   results: number;
   * }} options
   * @return {{
   *   results: {
   *     gender: "female" | "male";
   *     name: {
   *       title: string;
   *       first: string;
   *       last: string;
   *     };
   *     email: string;
   *     login: {
   *       uuid: string;
   *       username: string;
   *       password: string;
   *       salt: string;
   *       md5: string;
   *       sha1: string;
   *       sha256: string;
   *     };
   *     cell: string;
   *     id: {
   *       name: string;
   *       value: string;
   *     };
   *     picture: {
   *       large: string;
   *       medium: string;
   *       thumbnail: string;
   *     };
   *   }[];
   *   info: {
   *     seed: string;
   *     results: number;
   *     page: number;
   *     version: string;
   *   };
   * }} options
   */
  static async getAPIRandomUser({ results }) {
    const url = `https://randomuser.me/api/?results=${results}&password=special%2Cnumber%2Cupper%2Clower%2C8-64&format=json&inc=gender%2Cname%2Clogin%2Cemail%2Ccell%2Cid%2Cpicture`;
    const response = await fetch(url);
    return await response.json();
  }

  /**
   * @param {{
   *   count: number;
   *   types: ('client' | 'supplier' | 'seller')[];
   *   saveToFile: boolean;
   * }} options
   */
  static async users({
    count,
    types = ["client", "seller", "supplier"],
    saveToFile = true
  }) {
    const responseData = await testRepository.getAPIRandomUser({
      results: count
    });
    const usersData = [];

    for (let i = 0; i < count; i++) {
      const userData = {};
      const userRandom = responseData.results[i];

      const user = {
        id: userRandom.login.uuid,
        identificationId: 4,
        identificationNumber: userRandom.id.value,
        image: Math.random() > 0.5 ? userRandom.picture.thumbnail : undefined
      };

      if (types.includes("client") && Math.random() > 0.5) {
        const client = {
          ...user,
          names: userRandom.name.first,
          surnames: userRandom.name.last,
          genderId: userRandom.gender === "male" ? 1 : 2
        };
        userRepository.createClient({ ...client });
        userData.client = client;
      }
      if (types.includes("seller") && Math.random() > 0.5) {
        const seller = {
          ...user,
          names: userRandom.name.first,
          surnames: userRandom.name.last,
          genderId: userRandom.gender === "male" ? 1 : 2,
          roleId: Math.random() > 0.5 ? 2 : 3,
          password: userRandom.login.password
        };
        userRepository.createSeller({ ...seller });
        userData.seller = seller;
      }
      if (types.includes("supplier") && Math.random() > 0.5) {
        const supplier = {
          ...user,
          businessName: `${userRandom.name.first} ${userRandom.name.last} S.A.`
        };
        userRepository.createSupplier({ ...supplier });
        userData.supplier = supplier;
      }

      usersData.push(userData);
    }

    if (saveToFile) {
      await testRepository.saveToFile({
        data: usersData,
        filename: `${responseData.info.seed}.json`
      });
    }
  }

  static async saveToFile({ data, filename }) {
    const folderPath = path.join(DIRNAME_PATH, "testData", "users");
    await fs.mkdir(folderPath, { recursive: true });
    const filePath = path.join(folderPath, filename);
    await fs.writeFile(filePath, JSON.stringify(data));
  }
}
