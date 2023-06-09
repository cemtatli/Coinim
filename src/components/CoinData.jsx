import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Sparklines, SparklinesLine } from "react-sparklines";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

import { UserAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { arrayUnion, doc, updateDoc, getDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { useAutoAnimate } from "@formkit/auto-animate/react";

export default function CoinData({ coin }) {
  const [savedCoin, setSavedCoin] = useState(false);
  const { user } = UserAuth();
  const [animationParent] = useAutoAnimate();
  const { t } = useTranslation();

  const coinPath = doc(db, "users", `${user?.email}`);
  const saveCoin = async () => {
    if (user?.email) {
      setSavedCoin(true);
      await updateDoc(coinPath, {
        watchList: arrayUnion({
          id: coin.id,
          name: coin.name,
          image: coin.image,
          rank: coin.market_cap_rank,
          symbol: coin.symbol,
          price: coin.current_price,
          change24: coin.price_change_24h,
          percentage24: coin.price_change_percentage_24h,
        }),
      });
      toast.success(`${coin.name}` + t("coinData.saveCoinSuccess"));
    } else {
      toast.error(t("coinData.saveCoinError"));
    }
  };

  useEffect(() => {
    const getSavedCoin = async () => {
      if (user?.email) {
        const docSnap = await getDoc(coinPath);
        if (docSnap.exists()) {
          const watchList = docSnap.data().watchList;
          if (watchList.some((watchedCoin) => watchedCoin.id === coin.id)) {
            setSavedCoin(true);
          }
        }
      }
    };
    getSavedCoin();
  }, [coin.id, coinPath, user?.email]);

  return (
    <>
      <tr key={coin.id} className="h-20 overflow-hidden border-b text-center dark:border-white dark:border-opacity-10">
        <td className="cursor-pointer" onClick={saveCoin} ref={animationParent}>
          {savedCoin ? (
            <AiFillStar className="h-3.5 w-3.5 cursor-pointer text-orange-400 md:h-4 md:w-4" />
          ) : (
            <AiOutlineStar className="h-3.5 w-3.5 cursor-pointer text-blue-600 dark:text-white md:h-4 md:w-4" />
          )}
        </td>
        <td className="text-xs font-medium xs:text-sm sm:text-base">{coin.market_cap_rank}</td>
        <td>
          <Link to={`/coin/${coin.id}`}>
            <div className="mx-auto flex w-full max-w-[150px] flex-col items-center justify-center gap-2 md:max-w-[225px] md:flex-row md:gap-5 lg:justify-start lg:gap-2.5 ">
              <img src={coin.image} title={coin.name} className={"h-7 w-7 xs:h-8 xs:w-8 sm:h-10 sm:w-10"} alt={coin.id} />
              <span className="hidden overflow-hidden text-xs font-medium xs:block sm:text-sm md:w-full md:text-base">
                {coin.name}
                <span className="ml-1 text-xs uppercase text-black dark:text-white">({coin.symbol})</span>
              </span>
            </div>
          </Link>
        </td>
        <td className="text-xs font-medium xs:text-sm">${coin.current_price.toFixed(2)}</td>
        <td className="hidden text-xs font-medium xxs:table-cell xs:text-sm ">
          {coin.price_change_percentage_24h > 0 ? (
            <p className="  text-green-500 dark:text-green-400">{coin.price_change_24h.toFixed(2).toLocaleString("tr-TR")}$</p>
          ) : (
            <p className="text-red-500 dark:text-red-500">{coin.price_change_24h.toFixed(2)}$</p>
          )}
        </td>
        <td className="text-xs font-medium  xs:text-sm ">
          {coin.price_change_percentage_24h > 0 ? (
            <p className="  text-green-500 dark:text-green-400">{coin.price_change_percentage_24h.toFixed(2).toLocaleString("tr-TR")}%</p>
          ) : (
            <p className="text-red-500  dark:text-red-500">{coin.price_change_percentage_24h.toFixed(2)}%</p>
          )}
        </td>

        <td className="hidden text-sm font-medium sm:table-cell">${coin.total_volume.toLocaleString("tr-TR")}</td>

        <td className="hidden max-w-[80px] text-sm font-medium xl:table-cell">{coin.total_supply ? coin.total_supply : "-"}</td>
        <td className="hidden text-sm font-medium xl:table-cell">${coin.market_cap.toLocaleString("tr-TR")}</td>
        <td className="hidden text-sm font-medium 2xl:table-cell">${coin.atl.toFixed(2)}</td>
        <td className="hidden text-sm font-medium 2xl:table-cell">${coin.ath.toFixed(2)}</td>
        <td className="hidden pl-2 text-sm font-medium lg:table-cell lg:w-[200px]">
          <Sparklines data={coin.sparkline_in_7d.price}>
            <SparklinesLine color="#3B82F5" />
          </Sparklines>
        </td>
      </tr>
    </>
  );
}
