import { ProductType } from '../Product/ProductType'

type UnixTimeStamp = number;

export interface ProductCategoryStateType {
  loading:boolean,
  error:string,
  data:{
    total:number,
    currentPage:number,
    results:{
      [page:number]:{
        maxAge:UnixTimeStamp,
        results:ProductType[],
      }
    }
  },
}

export interface ProductCategoryType {
  name:string,
  sortId:number,
  category_id:number,
  photo:string,
  total:number,
}
