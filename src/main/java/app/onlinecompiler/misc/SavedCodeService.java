package app.onlinecompiler.misc;

import app.onlinecompiler.model.SavedCode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.UUID;

@Service
@Transactional
public class SavedCodeService {

    @Autowired
    private SavedCodeRepository savedCodeRepository;

    public String saveCodeForPrivate(SavedCode savedCode){
        String codeTag = UUID.randomUUID().toString();
        savedCode.setExpiresOn(new Date(new Date().getTime()+(30L * 24 * 60 * 60 * 1000)));
        savedCode.setCodeTag(codeTag);
        savedCode.setCodeType("PRIVATE");
        savedCodeRepository.save(savedCode);
        return codeTag;
    }

    public String saveCodeForCommunity(SavedCode savedCode){
        String codeTag = UUID.randomUUID().toString();
        savedCode.setExpiresOn(new Date()); // serves as creation date
        savedCode.setCodeTag(codeTag);
        savedCode.setCodeType("COMMUNITY");
        savedCodeRepository.save(savedCode);
        return codeTag;
    }

    public Page<SavedCode> searchCommunityCodes(String query, Integer page, Integer sortBy, Integer sortOrder){
        String sortByString = "expiresOn";
        query = query.trim();
        if (page<1)
            page = 1;
        if (sortOrder != 1 && sortOrder != 2)
            sortOrder = 1;
        switch (sortBy){
            case 1: sortByString = "expires_on"; break;
            case 2: sortByString =  "code_title"; break;
            case 3: sortByString = "code_language"; break;
            case 4: sortByString = "author"; break;
            default: break;
        }
        if (sortOrder == 1){
            return savedCodeRepository.searchCommunityCodes(PageRequest.of(page-1, 10, Sort.by(sortByString).ascending()), query);
        }else{
            return savedCodeRepository.searchCommunityCodes(PageRequest.of(page-1, 10, Sort.by(sortByString).descending()), query);
        }
    }

    public SavedCode getCodeByTag(String codeTag){
        return savedCodeRepository.findByCodeTag(codeTag).orElse(null);
    }

    public boolean deleteCode(String codeTag){
        if (codeTag != null) {
            SavedCode savedCode = savedCodeRepository.findByCodeTag(codeTag).orElse(null);
            if (savedCode != null){
                savedCodeRepository.delete(savedCode);
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }
    }

    public boolean updateCode(SavedCode savedCode){
        if (savedCode.getCodeTag() != null){
            SavedCode s = savedCodeRepository.findByCodeTag(savedCode.getCodeTag()).orElse(null);
            if (s != null){
                s.setCode(savedCode.getCode());
                s.setCodeInput(savedCode.getCodeInput());
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }
    }

}
