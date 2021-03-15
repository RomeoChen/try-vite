/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
interface User {
  name: string,
  age?: number,
}

async function mockFetch() {
  const users: User[] = [{ name: 'romeo' }, { name: 'jack' }];
  return Promise.resolve(users);
}
/**
 * case 1, not use ||, use ?? or default value
 */
// bad case
function createUserBad(name: string, age: number, date?: Date) {
  return {
    name,
    age,
    date: date || new Date(),
  };
}
createUserBad('romeo', 20);
// good case 1
function createUserGood1(name: string, age: number, date?: Date) {
  return { name, age, date: date ?? new Date() };
}
createUserGood1('jack', 20);
// good case 2
function createUserGood2(name: string, age: number, date: Date = new Date()) {
  return { name, age, date };
}
createUserGood2('jack', 20);

/**
 * case 2, use unknown instead of any
 */
// bad case, use any
async function loadUsersBad(): Promise<User[]> {
  const res: any = await mockFetch();
  return res;
}
// good case, use unknown
async function loadUsersGood(): Promise<User[]> {
  const res: unknown = await mockFetch();
  return res as User[];
}

/**
 * case 3, use type guard
 */
// bad case
async function getUsersBad(): Promise<User[]> {
  const res: unknown = await mockFetch();
  return res as User[];
}
// good case
function isUser(obj: unknown): obj is User {
  return obj !== null
    && typeof (obj as User).name === 'string';
}
function isArrayOfUser(obj: unknown): obj is User[] {
  return Array.isArray(obj) && obj.every(isUser);
}
const users = [{ name: 'romeo' }, { name: 'jack' }];
console.log('isArrayOfUser: ', isArrayOfUser(users));

/**
 * case 4, 尽可能避免可选属性，应该明确属性的存在
 * 对于产品类型来说，数字产品有 sizeInMb 属性，物理产品有 weightInKg 属性
 * 应该将两者区分开成不同的具体类型，而不是写成一种
 */
// bad case
interface Product1 {
  id: string
  type: 'digital' | 'physical'
  price: number
  weightInKg?: number
  sizeInMb?: number
}
// good case
interface Product2 {
  id: string
  type: 'digital' | 'physical'
  price: number
}
interface DigitalProduct extends Product2 {
  type: 'digital'
  sizeInMb: number
}
interface PhysicalProduct extends Product2 {
  type: 'physical'
  weightInKg: number
}
