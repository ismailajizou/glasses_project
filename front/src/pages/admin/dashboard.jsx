import StatCard from "@/components/cards/StatCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import useFetch from "@/hooks/useFetch";
import AdminLayout from "@/layouts/AdminLayout";
import { FaGlasses } from "react-icons/fa";
import { GiSpectacleLenses, GiSunglasses } from "react-icons/gi";
import { SiMaterialdesignicons } from "react-icons/si";
import { MdOutlineCollectionsBookmark, MdOutlineVerified } from "react-icons/md";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = ({}) => {
  useAuth({ middleware: "auth", redirectIfError: "/admin/login" });
  const { data: stats, error } = useFetch("/admin/dashboard");
  if (error) return <div>Error: {error.response.data.message}</div>;
  if (!stats) return <LoadingSpinner />;
  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto pt-4 px-2 sm:px-6 lg:px-8">
        <div className="flex justify-center flex-wrap">
          <StatCard
            title={"glasses"}
            value={stats.glasses.total}
            Icon={GiSunglasses}
            link={"/admin/glasses"}
          />
          <StatCard
            title={"brands"}
            value={stats.brands.total}
            Icon={MdOutlineVerified}
            variant="purple"
            secondaryNote={"Currently active " + stats.brands.active}
            link={"/admin/brands"}
          />
          <StatCard
            title={"collections"}
            value={stats.collections.total}
            Icon={MdOutlineCollectionsBookmark}
            variant="red"
            secondaryNote={"Currently active " + stats.collections.active}
            link={"/admin/collections"}
          />
          <StatCard
            title={"frame colors"}
            value={stats.frames.colors.total}
            Icon={FaGlasses}
            variant="green"
            secondaryNote={"Currently active " + stats.frames.colors.active}
            link={"/admin/frames/colors"}
          />
          <StatCard
            title={"frame materials"}
            value={stats.frames.materials.total}
            Icon={SiMaterialdesignicons}
            variant="orange"
            secondaryNote={"Currently active " + stats.frames.materials.active}
            link={"/admin/frames/materials"}
          />
          <StatCard
            title={"lens colors"}
            value={stats.lens.colors.total}
            Icon={GiSpectacleLenses}
            variant="pink"
            secondaryNote={"Currently active " + stats.lens.colors.active}
            link={"/admin/lens/colors"}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
