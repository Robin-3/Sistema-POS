import { type ChangeEvent, type FormEvent, useState } from 'react';
import { BookUser, CalendarCog, ChevronDown, ChevronUp, Dna, FileDigit, FileType2, Hash, Image, Trash2, WholeWord } from 'lucide-react';

const SellerUpdateForm = ({ seller }: {
  seller: {
    id: string;
    identification: {
      code: string;
      name: string;
      number: string;
    };
    image: string;
    created_at: number;
    contacts: {
      contact: string;
      type: string;
    }[];
    names: string;
    surnames: string;
    businessName?: string;
    gender: string;
    seller?: {
      role: string;
      topOf: {
        id: string;
        identification: {
          code: string;
          name: string;
          number: string;
        };
        names: string;
        surnames: string;
        image?: string;
        role: string;
      }[];
    };
    taxRegimeCode?: string;
    economicActivityCode?: string;
    userType: ("Cliente" | "Proveedor" | "Vendedor")[];
  };
}) => {
  const [generalExpanded, setGeneralExpanded] = useState(true);
  const [contactExpanded, setContactExpanded] = useState(false);
  const [formData, setFormData] = useState(seller);

  const inputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const dateValue = (): string => {
    const date = new Date(seller.created_at);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // todo
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Perfil
        </h2>
      </div>

      <form onSubmit={submit}>
        {/* General */}
        <div className="mb-6">
          <button
            type="button"
            className="flex justify-between items-center w-full text-left text-lg font-semibold text-gray-900 dark:text-white"
            onClick={() => setGeneralExpanded(!generalExpanded)}
          >
            General
            {generalExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {(
            <div className={`${!generalExpanded ? "hidden " : ""}mt-4 space-y-4`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="id" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    ID
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                      <Hash className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </span>
                    <input
                      type="text"
                      id="id"
                      className="rounded-none rounded-e-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={formData.id}
                      disabled
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="created-at" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Creado el
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                      <CalendarCog className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </span>
                    <input
                      type="date"
                      id="created-at"
                      name="created-at"
                      value={dateValue()}
                      className="rounded-none rounded-e-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      readOnly
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="identification-name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Tipo de documento
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                      <FileType2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </span>
                    <input
                      type="text"
                      id="identification-name"
                      name="identification-name"
                      className="rounded-none rounded-e-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={formData.identification.name}
                      readOnly
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="identification-number" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Número del documento
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                      <FileDigit className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </span>
                    <input
                      type="text"
                      id="identification-number"
                      name="identification-number"
                      value={formData.identification.number}
                      className="rounded-none rounded-e-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      readOnly
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                  <label htmlFor="gender" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Género
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                      <Dna className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </span>
                    <input
                      type="text"
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      className="rounded-none rounded-e-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      readOnly
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="image" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Url de imagen
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                      <Image className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </span>
                    <input
                      type="text"
                      id="image"
                      name="image"
                      value={formData.image}
                      onChange={inputChange}
                      className="rounded-none rounded-e-lg border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5  dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                  <label htmlFor="names" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Nombres
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                      <WholeWord className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </span>
                    <input
                      type="text"
                      id="names"
                      name="names"
                      value={formData.names}
                      onChange={inputChange}
                      className="rounded-none rounded-e-lg border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5  dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="surnames" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Apellidos
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                      <WholeWord className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </span>
                    <input
                      type="text"
                      id="surnames"
                      name="surnames"
                      value={formData.surnames}
                      onChange={inputChange}
                      className="rounded-none rounded-e-lg border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5  dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Contactos */} {/* todo */}
        <div className="mb-6">
          <button
            type="button"
            className="flex justify-between items-center w-full text-left text-lg font-semibold text-gray-900 dark:text-white"
            onClick={() => setContactExpanded(!contactExpanded)}
          >
            Contactos
            {contactExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {(
            <div className={`${!contactExpanded ? "hidden " : ""}mt-4 space-y-4`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Contacto 1
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                      <BookUser className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </span>
                    <input
                      type="text"
                      className="rounded-none rounded-e-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Lista de vendedores a cargo */} {/* todo */}
        {/* Posibilidad de añadir el tipo de cliente (checbox) */} {/* todo */}
        {/* Comprobar si es un poveedor y la razón social */} {/* todo */}

        <div className="flex justify-between mt-8">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Update user
          </button>
          <button
            type="button"
            /* todo: realizar la eliminación del usuario */
            className="px-6 py-2 bg-white text-red-600 border border-red-600 rounded-md hover:bg-red-50 flex items-center"
          >
            <Trash2 size={16} className="mr-2" />
            Delete
          </button>
        </div>
      </form>
    </div>
  );
};

export default SellerUpdateForm;
