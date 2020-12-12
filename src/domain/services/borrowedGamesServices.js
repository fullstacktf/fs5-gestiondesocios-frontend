import BorrowedGames from "../../utils/borrowed_games";

export const getBorrowedGames = async () => {
  const borrowedGames = new BorrowedGames();
  const data = await borrowedGames.getBorrowedGames();
  return data;
};

export const insertBorrowedGames = async (id) => {
  const borrowedGames = new BorrowedGames();
  const data = await borrowedGames.insertBorrowedGames(id);
  return data;
};

export const deleteBorrowedGames = async (id) => {
  const borrowedGames = new BorrowedGames();
  const data = await borrowedGames.deleteBorrowedGames(id);
  return data;
};