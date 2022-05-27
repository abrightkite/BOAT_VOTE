import React, { useState, useEffect, useCallback } from "react";
import ScrollView from "../ScrollView";
import { getBlockType } from "../../../typedef/common/common.types";
import usePopUp from "../../../hooks/usePopUp";
import WritePopUpContainer from "./WritePopUpContainer";
import useAuth from "../../../hooks/Auth/useAuth";

type Props = {
  itemList: getBlockType[];
  editItemList: any;
  next: string;
  getBlocks: any;
};

const ScrollViewContainer = ({
  itemList,
  editItemList,
  next,
  getBlocks,
}: Props) => {
  const { token } = useAuth();
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const [loading, setLoading] = useState(false);
  const { __showPopUpFromHooks, __hidePopUpFromHooks } = usePopUp();

  const onload = useCallback(() => {
    console.log(token);
  }, [token]);
  const closePopUp = useCallback(() => {
    __hidePopUpFromHooks();
  }, []);

  const loadPopUp = useCallback(() => {
    __showPopUpFromHooks(<WritePopUpContainer closePopUp={closePopUp} />);
  }, []);

  const addItemList = (blocks: getBlockType[]) => {
    editItemList([...itemList, ...blocks]);
  };

  const intersecting = async ([entry]: IntersectionObserverEntry[]) => {
    if (entry.isIntersecting) {
      const blocks = await getBlocks();
      setLoading(true);
      addItemList(blocks);
      setLoading(false);
    }
  };

  const observer = new IntersectionObserver(intersecting, { threshold: 0.4 });

  useEffect(() => {
    if (!target) return;

    observer.observe(target);
  }, [target]);

  useEffect(() => {
    onload();
  }, []);

  return (
    <ScrollView
      setTarget={setTarget}
      loading={loading}
      itemList={itemList}
      loadPopUp={loadPopUp}
      next={next}
    />
  );
};

export default ScrollViewContainer;
