import ContentLoader from 'react-content-loader';
import { IsMobile } from '../functions/isMobile';
import { TailSpin } from 'react-loader-spinner';
import { useSelector } from 'react-redux';

export const Spinner = () => {
  const theme = useSelector((state) => state.storeMain.theme);
  return (
    <TailSpin
      height="80"
      width="80"
      color="#4fa94d"
      ariaLabel="tail-spin-loading"
      radius="1"
      wrapperStyle={{}}
      wrapperClass=""
      visible={true}
    />
  );
};

export const LineLoader = (props) => {
  const theme = useSelector((state) => state.storeMain.theme);
  const isMobile = IsMobile();
  return (
    <ContentLoader
      speed={0.5}
      width={isMobile ? 700 : 700}
      height={isMobile ? 15 : 15}
      backgroundColor={theme ? '#151515' : '#f3f3f3'}
      foregroundColor={theme ? '#30102E' : '#F7E6FF'}
      {...props}
    >
      <rect
        x={isMobile ? 0 : 0}
        y={isMobile ? 0 : 0}
        rx={isMobile ? 10 : 10}
        ry={isMobile ? 10 : 10}
        width={isMobile ? 300 : 400}
        height={isMobile ? 15 : 15}
      />
    </ContentLoader>
  );
};
export const IconLoader = (props) => {
  const theme = useSelector((state) => state.storeMain.theme);
  const isMobile = IsMobile();
  return (
    <ContentLoader
      speed={0.5}
      width={isMobile ? 25 : 50}
      height={isMobile ? 15 : 15}
      backgroundColor={theme ? '#151515' : '#f3f3f3'}
      foregroundColor={theme ? '#30102E' : '#F7E6FF'}
      {...props}
    >
      <rect
        x={isMobile ? 0 : 0}
        y={isMobile ? 0 : 0}
        rx={isMobile ? 10 : 10}
        ry={isMobile ? 10 : 10}
        width={isMobile ? 25 : 50}
        height={isMobile ? 15 : 15}
      />
    </ContentLoader>
  );
};
export const TextLoader = (props) => {
  const isMobile = IsMobile();
  const theme = useSelector((state) => state.storeMain.theme);
  return (
    <ContentLoader
      speed={0.5}
      width={isMobile ? 300 : 300}
      height={isMobile ? 15 : 18}
      backgroundColor={theme ? '#151515' : '#f3f3f3'}
      foregroundColor={theme ? '#30102E' : '#F7E6FF'}
      {...props}
    >
      <rect
        x={isMobile ? 0 : 0}
        y={isMobile ? 0 : 0}
        rx={isMobile ? 10 : 10}
        ry={isMobile ? 10 : 10}
        width={isMobile ? 300 : 300}
        height={isMobile ? 15 : 18}
      />
    </ContentLoader>
  );
};
export const TitleLoader = (props) => {
  const isMobile = IsMobile();
  const theme = useSelector((state) => state.storeMain.theme);
  return (
    <ContentLoader
      speed={0.5}
      width={isMobile ? 150 : 150}
      height={isMobile ? 15 : 18}
      backgroundColor={theme ? '#151515' : '#f3f3f3'}
      foregroundColor={theme ? '#30102E' : '#F7E6FF'}
      {...props}
    >
      <rect
        x={isMobile ? 0 : 0}
        y={isMobile ? 0 : 0}
        rx={isMobile ? 10 : 10}
        ry={isMobile ? 10 : 10}
        width={isMobile ? 150 : 150}
        height={isMobile ? 15 : 18}
      />
    </ContentLoader>
  );
};
export const TitleLoader2 = (props) => {
  const isMobile = IsMobile();
  const theme = useSelector((state) => state.storeMain.theme);
  return (
    <ContentLoader
      speed={0.5}
      width={isMobile ? 190 : 190}
      height={isMobile ? 15 : 18}
      backgroundColor={theme ? '#151515' : '#f3f3f3'}
      foregroundColor={theme ? '#30102E' : '#F7E6FF'}
      {...props}
    >
      <rect
        x={isMobile ? 0 : 0}
        y={isMobile ? 0 : 0}
        rx={isMobile ? 10 : 10}
        ry={isMobile ? 10 : 10}
        width={isMobile ? 190 : 190}
        height={isMobile ? 15 : 18}
      />
    </ContentLoader>
  );
};
export const LinkLoader = (props) => {
  const isMobile = IsMobile();
  const theme = useSelector((state) => state.storeMain.theme);
  return (
    <ContentLoader
      speed={0.5}
      width={isMobile ? 150 : 250}
      height={isMobile ? 25 : 200}
      backgroundColor={theme ? '#151515' : '#f3f3f3'}
      foregroundColor={theme ? '#30102E' : '#F7E6FF'}
      {...props}
    >
      <rect
        x={isMobile ? 0 : 0}
        y={isMobile ? 0 : 0}
        rx={isMobile ? 10 : 10}
        ry={isMobile ? 10 : 10}
        width={isMobile ? 150 : 250}
        height={isMobile ? 25 : 15}
      />
      <rect
        x={isMobile ? 0 : 0}
        y={isMobile ? 65 : 40}
        rx={isMobile ? 10 : 10}
        ry={isMobile ? 10 : 10}
        width={isMobile ? 100 : 150}
        height={isMobile ? 25 : 15}
      />
      <rect
        x={isMobile ? 0 : 0}
        y={isMobile ? 70 : 75}
        rx={isMobile ? 10 : 10}
        ry={isMobile ? 10 : 10}
        width={isMobile ? 50 : 50}
        height={isMobile ? 25 : 15}
      />
    </ContentLoader>
  );
};
export const NavigatorLoader = (props) => {
  const isMobile = IsMobile();
  const theme = useSelector((state) => state.storeMain.theme);
  return (
    <ContentLoader
      speed={0.5}
      width={isMobile ? 450 : 550}
      height={isMobile ? 15 : 25}
      backgroundColor={theme ? '#151515' : '#f3f3f3'}
      foregroundColor={theme ? '#30102E' : '#F7E6FF'}
      {...props}
    >
      <rect
        x={isMobile ? 0 : 0}
        y={isMobile ? 0 : 0}
        rx={isMobile ? 10 : 10}
        ry={isMobile ? 10 : 10}
        width={isMobile ? 450 : 550}
        height={isMobile ? 15 : 25}
      />
    </ContentLoader>
  );
};
export const SendMessageLoader = (props) => {
  const isMobile = IsMobile();
  const theme = useSelector((state) => state.storeMain.theme);
  return (
    <ContentLoader
      speed={0.5}
      width={isMobile ? 350 : 200}
      height={isMobile ? 20 : 15}
      backgroundColor={theme ? '#151515' : '#f3f3f3'}
      foregroundColor={theme ? '#30102E' : '#F7E6FF'}
      {...props}
    >
      <rect
        x={isMobile ? 0 : 0}
        y={isMobile ? 0 : 0}
        rx={isMobile ? 0 : 10}
        ry={isMobile ? 0 : 10}
        width={isMobile ? 350 : 200}
        height={isMobile ? 20 : 15}
      />
    </ContentLoader>
  );
};
export const TypeLoader = (props) => {
  const theme = useSelector((state) => state.storeMain.theme);
  const isMobile = IsMobile();
  return (
    <ContentLoader
      speed={0.5}
      width={isMobile ? 100 : 100}
      height={isMobile ? 12 : 15}
      backgroundColor={theme ? '#151515' : '#f3f3f3'}
      foregroundColor={theme ? '#30102E' : '#F7E6FF'}
      {...props}
    >
      <rect
        x={isMobile ? 0 : 0}
        y={isMobile ? 0 : 0}
        rx={isMobile ? 10 : 10}
        ry={isMobile ? 10 : 10}
        width={isMobile ? 100 : 100}
        height={isMobile ? 10 : 12}
      />
    </ContentLoader>
  );
};
export const CoverLoader = (props) => {
  const isMobile = IsMobile();
  const theme = useSelector((state) => state.storeMain.theme);
  return (
    <ContentLoader
      speed={0.5}
      width={isMobile ? 80 : 150}
      height={isMobile ? 80 : 150}
      backgroundColor={theme ? '#151515' : '#f3f3f3'}
      foregroundColor={theme ? '#30102E' : '#F7E6FF'}
      {...props}
    >
      <circle
        cx={isMobile ? 15 : 10}
        cy={isMobile ? 0 : 0}
        r={isMobile ? 50 : 50}
      />
    </ContentLoader>
  );
};
export const CardImageLoader = (props) => {
  const isMobile = IsMobile();
  const theme = useSelector((state) => state.storeMain.theme);
  return (
    <ContentLoader
      speed={0.5}
      width={isMobile ? 200 : 200}
      height={200}
      backgroundColor={theme ? '#151515' : '#f3f3f3'}
      foregroundColor={theme ? '#30102E' : '#F7E6FF'}
      {...props}
    >
      <rect
        x={isMobile ? 0 : 0}
        y={isMobile ? 0 : 0}
        rx={isMobile ? 0 : 0}
        ry={isMobile ? 0 : 0}
        width={isMobile ? 200 : 200}
        height={200}
      />
    </ContentLoader>
  );
};
export const ProfileCoverLoader = (props) => {
  const isMobile = IsMobile();
  const theme = useSelector((state) => state.storeMain.theme);
  return (
    <ContentLoader
      speed={0.5}
      width={isMobile ? 100 : 150}
      height={isMobile ? 100 : 150}
      backgroundColor={theme ? '#151515' : '#f3f3f3'}
      foregroundColor={theme ? '#30102E' : '#F7E6FF'}
      {...props}
    >
      <circle
        cx={isMobile ? 50 : 75}
        cy={isMobile ? 50 : 75}
        r={isMobile ? 50 : 75}
      />
    </ContentLoader>
  );
};
export const ImgLoader = (props) => {
  const isMobile = IsMobile();
  const theme = useSelector((state) => state.storeMain.theme);
  return (
    <ContentLoader
      speed={0.5}
      width={isMobile ? 800 : 800}
      height={800}
      backgroundColor={theme ? '#151515' : '#f3f3f3'}
      foregroundColor={theme ? '#30102E' : '#F7E6FF'}
      {...props}
    >
      <rect
        x={isMobile ? 0 : 0}
        y={isMobile ? 0 : 0}
        rx={isMobile ? 0 : 0}
        ry={isMobile ? 0 : 0}
        width={isMobile ? 800 : 800}
        height={800}
      />
    </ContentLoader>
  );
};
export const AddReviewLoader = (props) => {
  const isMobile = IsMobile();
  const theme = useSelector((state) => state.storeMain.theme);
  return (
    <ContentLoader
      speed={0.5}
      width={props.width}
      height={40}
      backgroundColor={theme ? '#151515' : '#f3f3f3'}
      foregroundColor={theme ? '#30102E' : '#F7E6FF'}
      {...props}
    >
      <rect
        x={isMobile ? 0 : 0}
        y={isMobile ? 0 : 0}
        rx={isMobile ? 0 : 0}
        ry={isMobile ? 0 : 0}
        width={props.width}
        height={40}
      />
    </ContentLoader>
  );
};
export const MapLoader = (props) => {
  const isMobile = IsMobile();
  const theme = useSelector((state) => state.storeMain.theme);
  return (
    <ContentLoader
      speed={0.5}
      width={isMobile ? 800 : 700}
      height={isMobile ? 250 : 190}
      backgroundColor={theme ? '#151515' : '#f3f3f3'}
      foregroundColor={theme ? '#30102E' : '#F7E6FF'}
      {...props}
    >
      <rect
        x={isMobile ? 0 : 0}
        y={isMobile ? 0 : 0}
        rx={isMobile ? 0 : 15}
        ry={isMobile ? 0 : 15}
        width={isMobile ? 800 : 700}
        height={isMobile ? 250 : 190}
      />
    </ContentLoader>
  );
};
