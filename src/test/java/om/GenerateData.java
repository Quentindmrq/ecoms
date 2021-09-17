package om;

import de.svenjacobs.loremipsum.LoremIpsum;
import java.io.FileNotFoundException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.util.Random;
import om.cgi.formation.jhipster.ecom.domain.enumeration.Game;
import om.cgi.formation.jhipster.ecom.domain.enumeration.ProductType;
import om.cgi.formation.jhipster.ecom.domain.enumeration.Rank;
import om.cgi.formation.jhipster.ecom.domain.enumeration.Region;

public class GenerateData {

    static final Random rd = new Random();

    public static <T extends Enum<?>> T randomEnum(Class<T> clazz) {
        int x = rd.nextInt(clazz.getEnumConstants().length);
        return clazz.getEnumConstants()[x];
    }

    public static void main(String[] args) throws FileNotFoundException, UnsupportedEncodingException {
        LoremIpsum loremIpsum = new LoremIpsum();

        PrintWriter writerProduct = new PrintWriter("product.csv", "UTF-8");
        PrintWriter writerStock = new PrintWriter("stock.csv", "UTF-8");

        Game games[] = Game.values();
        ProductType prods[] = ProductType.values();

        long id = 0;

        String[] pseudos = {
            "SeekNDstroy",
            " Bulletz4Breakfast",
            " BigDamnHero",
            " LaidtoRest",
            " IronMAN77",
            " Xenomorphing",
            " TylerDurden",
            " PennywiseTheClown",
            " BluntMachete",
            " SniperLyfe",
            "SilentWraith",
            " BloodyAssault",
            " FightClubAlum",
            " KillSwitch",
            " ExecuteElectrocute",
        };

        writerProduct.write("id;name;description;logo;price;game;product_type;region;account_level;account_rank;target_rank\n");
        writerStock.write("id;stock;product_id;version\n");

        for (Game game : games) {
            for (ProductType prod : prods) {
                for (int i = 0; i < 10; i++) {
                    //id
                    writerProduct.write(id + ";");

                    //name
                    writerProduct.write(pseudos[Math.toIntExact(rd.nextInt(pseudos.length))] + "_" + game + "_" + prod + ";");

                    //description
                    writerProduct.write(loremIpsum.getWords(100) + ";");

                    //logo pour l'instant rien
                    writerProduct.write("logo;");

                    //price
                    writerProduct.write(i * 10 + ";");

                    //game
                    writerProduct.write(game + ";");

                    //type
                    writerProduct.write(prod + ";");

                    //region
                    writerProduct.write(randomEnum(Region.class) + ";");

                    //level
                    writerProduct.write(rd.nextInt() + ";");

                    //rank1
                    writerProduct.write(randomEnum(Rank.class) + ";");

                    //rank2
                    writerProduct.write(randomEnum(Rank.class) + "\n");

                    //
                    // STOCKS NOW
                    //

                    //id
                    writerStock.write(id + ";");

                    //stock
                    writerStock.write(rd.nextInt(10) + ";");

                    //product
                    writerStock.write(id + ";");

                    //version
                    writerStock.write("1\n");

                    id++;
                }
            }
        }

        writerProduct.close();
        writerStock.close();
    }
}
