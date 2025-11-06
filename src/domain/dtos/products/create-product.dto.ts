import { Validators } from "../../../config";

export class CreateProductDto {
  private constructor(
    public readonly name: string,
    public readonly available: boolean,
    public readonly price: number,
    public readonly description: string,
    public readonly user: string,
    public readonly category: string
  ) {}

  static create(props: { [key: string]: any }): [string?, CreateProductDto?] {
    const {
      name,
      available = false,
      price,
      description,
      user,
      category,
    } = props;

    if (!name) return ['Missing Name'];
    if (!user) return ['Missing User'];
    if(Validators.isMongoId(user)) return ['Invalid UserId'];
    if (!category) return ['Missing Category'];
    if(Validators.isMongoId(category)) return ['Invalid CategoryId'];

    return [
      ,
      new CreateProductDto(
        name,
        !!available,
        price,
        description,
        user,
        category
      ),
    ];
  }
}
