import { zodResolver } from "@hookform/resolvers/zod";
import { get } from "lodash";
import { GetServerSidePropsContext, NextApiRequest } from "next";
import { ReactElement, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { createOrUpdate } from "@/helpers/create-or-update";
import { decryptJSON } from "@/helpers/decrypt-json";
import { encryptJSON } from "@/helpers/encrypt-json";
import { getById } from "@/helpers/get-by-id";
import { requireAuthentication } from "@/helpers/require-authentication";
import { NextPageWithLayout } from "@/interfaces/NextPageWithLayout";

import { Input } from "@/components/shared/input";
import { Layout } from "@/components/system/layout";

import { Autocomplete } from "@/components/shared/autocomplete";
import AutocompleteMultiple from "@/components/shared/autocompletemultiple";
import { Button } from "@/components/shared/button";
import { InputDecimal } from "@/components/shared/input-decimal";
import { PageTitle } from "@/components/shared/page-title";
import { Toggle } from "@/components/shared/switch";
import { TextArea } from "@/components/shared/textarea";
import { getHeaders } from "@/helpers/get-headers";
import { Product } from "@/interfaces/Product";
import { ProductCategory } from "@/interfaces/ProductCategory";
import fetchJson from "@/lib/fetch-json";

const schema = z.object({
  name: z.string().nonempty({ message: "Nome é obrigatório" }),
  price: z.preprocess((a: any) => {
    const value = a.toString();
    const floatValue = parseFloat(
      value.replace(/[^\d,-]/g, "").replace(",", ".")
    );

    return Number(z.coerce.string().parse(floatValue));
  }, z.coerce.number({ invalid_type_error: "O valor é obrigatório" }).min(0.01, { message: "O valor mínimo é de R$ 0,01" })),
  productCategoryId: z
    .string({ required_error: "Categoria do faq é obrigatório" })
    .nonempty({ message: "Categoria do faq é obrigatório" }),
  shortDescription: z.string().nonempty({ message: "Mensagem é obrigatória" }),
  description: z.string().nonempty({ message: "Mensagem é obrigatória" }),
  active: z.boolean().default(true),
});
type FormData = z.infer<typeof schema>;

interface PageProps {
  data: string;
}

interface PageDecryptedProps {
  productCategories: ProductCategory[];
  product: Product;
}

const url = "products";

const Page: NextPageWithLayout<PageProps> = (props: PageProps) => {
  const { productCategories, product } = decryptJSON<PageDecryptedProps>(
    props.data
  );

  const isEditing = get(product, "id");
  const [subcategories, setSubcategories] = useState([]);

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      productCategoryId:
        product?.productCategoryId ||
        (productCategories?.length > 0 ? productCategories[0].id : ""),
      name: product?.name || "",
      active: get(product, "active", true),
      price: product?.price || 0,
      description: product?.description || "",
      shortDescription: product?.shortDescription || "",
    },
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = methods;

  useEffect(() => {
    async function getSubcategories() {
      try {
        const response = await fetch("/api/list-subcategories-by-category", {
          method: "POST",
          body: JSON.stringify({ id: watch("productCategoryId") }),
        }).then((res) => res.json());

        setSubcategories(response.subcategories);
      } catch (error) {}
    }

    getSubcategories();
  }, [watch("productCategoryId")]);

  async function onSubmit(formData: FormData) {
    try {
      const newPrice = get(formData, "price", 0);

      formData.price = newPrice * 100;

      formData.subcategoryId = watch("subcategoryId");

      const response = await createOrUpdate({
        currentEntity: product,
        formData,
        entityName: "Produto",
        url,
      });

      if (get(response, "error", false)) {
        return;
      }

      if (!isEditing) reset();
    } catch (error) {
      console.log("error", error);
    }
  }

  return (
    <div className="border-b border-gray-900/10 pb-12 mt-16">
      <PageTitle
        title={`${isEditing ? "Editando" : "Cadastrando"} produto`}
        backUrl="/system/produto"
      />
      <form onSubmit={handleSubmit(onSubmit)} className="mt-16">
        <div className="space-y-12">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="col-span-full">
              <Controller
                control={control}
                name="active"
                render={({ field: { ref, ...field } }) => (
                  <Toggle
                    {...field}
                    question="Deseja deixar esse produto ativo?"
                  />
                )}
              />
            </div>
            <div className="col-span-3 sm:col-span-3 flex items-center justify-between">
              <Input
                isRequired
                divClasses="w-full"
                label="Nome do produto"
                {...register("name")}
                error={errors.name}
              />
            </div>
            <div className="col-span-3 sm:col-span-3 flex items-center justify-between ">
              <InputDecimal
                control={control}
                isRequired
                divClasses="w-full"
                label="Preço"
                {...register("price")}
                error={errors.price}
              />
            </div>
            <div className="col-span-3 sm:col-span-3 flex items-center justify-between ">
              <Autocomplete
                isRequired
                control={control}
                options={productCategories}
                label="Categoria do Produto"
                {...register("productCategoryId")}
                error={errors.name}
              />
            </div>
            <div className="col-span-3 sm:col-span-3 flex items-center justify-between ">
              <AutocompleteMultiple
                control={control}
                options={subcategories}
                isRequired
                label="Subcategorias"
                // name="subcategoryId"
                {...register("subcategoryId")} // aqui esta o erro
                divClasses="w-full"
              />
            </div>
            <div className="col-span-6 sm:col-span-6 flex items-center justify-between ">
              <TextArea
                divClasses="w-full"
                label="Descrição resumida"
                isRequired
                {...register("shortDescription")}
                error={errors.shortDescription}
              />
            </div>
            <div className="col-span-6 sm:col-span-6 flex items-center justify-between ">
              <TextArea
                divClasses="w-full"
                label="Descrição"
                isRequired
                {...register("description")}
                error={errors.description}
              />
            </div>
            <div className="col-span-full flex items-center justify-between">
              <p className="text-red-500 text-sm font-bold">
                Campos com * são de preenchimento obrigatório.
              </p>
              <Button type="submit" isLoading={isSubmitting}>
                {isEditing ? "Atualizar" : "Cadastrar"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export const getServerSideProps = requireAuthentication(
  async ({ req, query }: GetServerSidePropsContext) => {
    let product = {};
    const token = req.session.token as string;

    if (typeof query?.id === "string" && query?.id && query.id !== "new") {
      const response = await getById({
        id: query.id,
        url,
        token,
      });

      if (!response) {
        return {
          redirect: {
            destination: "/system/produto",
            permanent: false,
          },
        };
      }

      product = response.product;
    }

    const { headers } = getHeaders(req as NextApiRequest);
    const { productCategories } = await fetchJson<any>(
      "/product-categories/list",
      {
        method: "GET",
        headers,
      }
    );

    const data = encryptJSON({
      product,
      productCategories,
    });

    return {
      props: {
        data,
      },
    };
  }
);

export default Page;
